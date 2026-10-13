package com.scpes.placement.config;

import com.scpes.placement.entity.*;
import com.scpes.placement.repository.CompanyRegistrationRepository;
import com.scpes.placement.repository.CompanyRepository;
import com.scpes.placement.repository.DriveRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final CompanyRepository companyRepository;
    private final CompanyRegistrationRepository registrationRepository;
    private final DriveRepository driveRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (companyRepository.count() > 0) {
            log.info("Placement companies already initialized");
            return;
        }

        log.info("Initializing sample placement companies and drives...");

        // Company 1: Google
        Company google = new Company("Google", "Technology", "https://google.com", "Global technology leader");
        google = companyRepository.save(google);

        CompanyRegistration reg1 = new CompanyRegistration(google, "recruiter@google.com");
        reg1.setStatus(RegistrationStatus.APPROVED);
        registrationRepository.save(reg1);

        Drive googleDrive = new Drive();
        googleDrive.setCompany(google);
        googleDrive.setRole("Software Engineer");
        googleDrive.setCtc(BigDecimal.valueOf(18.00));
        googleDrive.setDriveDate(LocalDate.now().plusDays(5));
        googleDrive.setLastApplyDate(LocalDate.now().plusDays(10));
        googleDrive.setStatus(DriveStatus.OPEN);
        googleDrive.setCategory("SUPER_DREAM");
        googleDrive.getRounds().add(new DriveRound(googleDrive, 1, "Online Assessment", LocalDate.now().plusDays(5)));
        googleDrive.getRounds().add(new DriveRound(googleDrive, 2, "Technical Interview", LocalDate.now().plusDays(7)));
        googleDrive.getRounds().add(new DriveRound(googleDrive, 3, "Googlyness & Leadership", LocalDate.now().plusDays(9)));
        driveRepository.save(googleDrive);

        // Company 2: TCS Digital
        Company tcs = new Company("TCS Digital", "IT Services", "https://tcs.com", "Global consulting & IT leader");
        tcs = companyRepository.save(tcs);

        CompanyRegistration reg2 = new CompanyRegistration(tcs, "careers@tcs.com");
        reg2.setStatus(RegistrationStatus.APPROVED);
        registrationRepository.save(reg2);

        Drive tcsDrive = new Drive();
        tcsDrive.setCompany(tcs);
        tcsDrive.setRole("Digital Software Engineer");
        tcsDrive.setCtc(BigDecimal.valueOf(7.50));
        tcsDrive.setDriveDate(LocalDate.now().plusDays(12));
        tcsDrive.setLastApplyDate(LocalDate.now().plusDays(18));
        tcsDrive.setStatus(DriveStatus.OPEN);
        tcsDrive.setCategory("DREAM");
        tcsDrive.getRounds().add(new DriveRound(tcsDrive, 1, "National Qualifier Test", LocalDate.now().plusDays(12)));
        tcsDrive.getRounds().add(new DriveRound(tcsDrive, 2, "Technical + HR", LocalDate.now().plusDays(15)));
        driveRepository.save(tcsDrive);

        log.info("Placement sample companies and drives initialized successfully!");
    }
}
